*******************LAB-02 Exam***********************



—--------------------------------------------------------------------
Q-Make two network namespaces using 'red' and 'green' names, connect them with a bridge, and check connectivity.
You have to successfully ping Google's public IP from those network namespaces.



Introduction
In this blog, we’ll explore how to create two namespaces and connect them using virtual Ethernet (veth) pairs in a virtual machine (VM). For this demonstration, I’m using a Linux machine (VM).

Creating Two Network Namespaces
Add Namespaces
First, we add two network namespaces, namespace1 and namespace2, using the ip netns command.

$ sudo ip netns add namespace1
$ sudo ip netns add namespace2

# Check that iproute2 indeed creates the files
# under `/var/run/netns`.
sudo ip netns list
OR
sudo ls /var/run/netns/
OR
tree /var/run/netns/
├── namespace1
└── namespace2

Once the namespaces have been set up, we can confirm the isolation by taking advantage of ip netns exec and executing some commands there:

# We can verify that inside the namespace, only the
# loopback interface has been set.

$ sudo ip netns exec namespace1 \
        ip address show
$ sudo ip netns exec namespace2 \
        ip address show
Enable Loopback Interfaces
By default, network interfaces of newly created namespaces are down, including loopback interfaces. We need to turn them on.

sudo ip netns exec namespace1 ip link set lo up
sudo ip netns exec namespace1 ip link

sudo ip netns exec namespace2 ip link set lo up
sudo ip netns exec namespace2 ip link

At this point, we can start creating the veth pairs and associating one of their sides to their respective namespaces.

# Create the two pairs.


$ sudo ip link add veth1 type veth peer name br-veth1
$ sudo ip link add veth2 type veth peer name br-veth2

# Associate the non `br-` side
# with the corresponding namespace


$ sudo ip link set veth1 netns namespace1
$ sudo ip link set veth2 netns namespace2


These pairs act as tunnels between the namespaces (for instance, namespace1 and the default namespace).Now that the namespaces have an additional interface, check out that they’re actually there:

# Differently from before, now we see the
# extra interface (veth1) that we just added.
$ sudo ip netns exec namespace1 \
        ip address show

We can do so by making use of ip addr add from within the corresponding network namespaces:

# Assign the address 192.168.1.11 with netmask 255.255.255.0
# (see the `/24` mask there) to `veth1`.

# For namespace1

$ sudo ip netns exec namespace1 ip addr add 192.168.1.11/24 dev veth1
$ sudo ip netns exec namespace1 ip route
$ sudo ip netns exec namespace1 ping -c 2 192.168.1.1

                                           OR
$ sudo ip netns exec namespace1 \
         ip addr add 192.168.1.11/24 dev veth1
	ip route
ping -c 2 192.168.1.1

# Verify that the ip address has been set.

$ sudo ip netns exec namespace1 ip address show

# Repeat the process, assigning the address 192.168.1.12 with 
# netmask 255.255.255.0 to `veth2`.

# For namespace2

$ sudo ip netns exec namespace2 ip addr add 192.168.1.12/24 dev veth2
$ sudo ip netns exec namespace2 ip route
$ sudo ip netns exec namespace2 ping -c 2 192.168.1.1

                                           OR
$ sudo ip netns exec namespace2 \
         ip addr add 192.168.1.12/24 dev veth2
	ip route
ping -c 2 192.168.1.1

# Verify that the ip address has been set.

$ sudo ip netns exec namespace2 ip address show


Although we have both IPs and interfaces set, we can’t establish communication with them.
That’s because there’s no interface in the default namespace that can send the traffic to those namespaces - we didn’t either configure addresses to the other side of the veth pairs or configured a bridge device.
With the creation of the bridge device, we’re then able to provide the necessary routing, properly forming the network:
Create a Bridge

# Create the bridge device naming it `br1`
# and set it up:

$ sudo ip link add name br1 type bridge
$ sudo ip link set br1 up

# Check that the device has been created.

$ sudo ip link | grep br1

Configure IP for the Bridge
Assign an IP address to the bridge and check its configuration.

$ sudo ip addr add 192.168.1.1/24 dev br1
$ sudo ip addr
ping -c 2 192.168.1.1

With the bridge created, now it’s time to connect the bridge-side of the veth pair to the bridge device:

# Set the bridge veths from the default
# namespace up.

$ sudo ip link set br-veth1 up
$ sudo ip link set br-veth2 up

# Set the veths from the namespaces up too.

$ sudo ip netns exec namespace1 \
        ip link set veth1 up
$ sudo ip netns exec namespace2 \
        ip link set veth2 up

# Add the br-veth* interfaces to the bridge
# by setting the bridge device as their master.

$ sudo ip link set br-veth1 master br1
$ sudo ip link set br-veth2 master br1

# Check that the bridge is the master of the two
# interfaces that we set (i.e., that the two interfaces
# have been added to it).

$ sudo bridge link show br1

Verify Connectivity Between Namespaces
# For namespace1
# ping -c 2 host ip

$ sudo nsenter - -net=/var/run/netns/namespace1
ping -c 2 192.168.1.12
ping -c 2 192.168.1.1
ping -c 2 192.168.1.11

exit

# For namespace2

$ sudo nsenter - -net=/var/run/netns/namespace2
ping -c 2 192.168.1.11
ping -c 2 192.168.1.1
ping -c 2 192.168.1.12

exit


Connecting Namespaces to the Internet
Establishing Internet Connectivity
We’ll now enable the namespaces to access the internet. First, we need to add a default route.

# For namespace1

sudo ip netns exec namespace1 ping -c 2 8.8.8.8
sudo ip netns exec namespace1 route -n

sudo ip netns exec namespace1 ip route add default via 192.168.1.1
sudo ip netns exec namespace1 route -n

# Do the same for namespace2

sudo ip netns exec namespace2 ip route add default via 192.168.1.1
sudo ip netns exec namespace2 route -n

# now first ping the host machine eth0

ip addr | grep eth0

# ping from namespace1 to host ip
sudo ip netns exec namespace1 ping 172.31.13.55


Analyzing Traffic with tcpdump
Let’s use tcpdump to analyze traffic and understand how packets are traveling.
# Terminal-1: Ping google's DNS

sudo ip netns exec namespace1 ping 8.8.8.8

				OR
sudo ip netns exec namespace1 \
       		 ping 8.8.8.8


# Terminal-2: Observe traffic : still unreachable
sudo tcpdump -i eth0 icmp

# If no packets are captured, try capturing on br1

sudo tcpdump -i br1 icmp

# we can see the traffic at br0 but we don't get a response from eth0.
# it's because of IP forwarding issue

sudo cat /proc/sys/net/ipv4/ip_forward

# enabling ip forwarding by change value 0 to 1

sudo sysctl -w net.ipv4.ip_forward=1
sudo cat /proc/sys/net/ipv4/ip_forward

# terminal-2

sudo tcpdump -i eth0 icmp

Setting up NAT
To enable internet access, we can make use of NAT (network address translation) by placing an iptables rule in the POSTROUTING chain of the nat table.

sudo iptables -t nat -A POSTROUTING -s 192.168.1.0/24 ! -o br1 -j MASQUERADE

						OR

sudo iptables \
        -t nat \
        -A POSTROUTING \
        -s 192.168.1.0/24 \
        -j MASQUERADE

# -t specifies the table to which the commands should be directed to. By default it's a filter`.
# -A specifies that we're appending a rule to the chain then we tell the name after it
# -s specifies a source address (with a mask in this case).
# -j specifies the target to jump to (what action to take).

# Send some packets to 8.8.8.8

sudo ip netns exec namespace1 ping -c 2 8.8.8.8
sudo ip netns exec namespace2 ping -c 2 8.8.8.8


Conclusion
Creating and connecting network namespaces using virtual Ethernet is a powerful way to simulate complex network environments. This setup is particularly useful for network administrators and developers working with containerized applications.
