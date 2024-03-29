// Import necessary React and hooks from the 'react' library
import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the main functional component named 'App'
function App() {
  // Initialize state using the 'useState' hook to manage the fetched data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the 'useEffect' hook to perform side effects in the component
  useEffect(() => {
    // Define an asynchronous function 'fetchData' to fetch data from the server
    const fetchData = async () => {
      try {
        // Make a GET request to the server using 'axios' and store the response
        const response = await axios.get("/api/data");

        // Check if the response data is not undefined or null
        if (response.data != null) {
          // Update the state with the fetched data
          setData(response.data);
        } else {
          console.error("Unexpected data format received from server:", response.data);
          throw new Error("Data received from server is not in expected format");
        }
      } catch (error) {
        // Handle errors by setting the error state
        console.error("Error fetching data:", error);
        setError(error.message || "An error occurred while fetching data");
      } finally {
        // Set loading to false, whether the request was successful or not
        setLoading(false);
      }
    };

    // Call the 'fetchData' function when the component mounts (empty dependency array)
    fetchData();
  }, []); // Dependency array is empty, so this effect runs once after the initial render

  // Return the JSX structure for rendering in the browser
  return (
    <div>
      {/* Greeting message */}
      <h2>App.js works! Welcome to the React Application!</h2>

      {/* Use conditional rendering to check if data is available or if an error occurred */}
      {loading ? (
        // If still loading, render a loading message
        <p>Loading...</p>
      ) : error ? (
        // If an error occurred, render an error message
        <p>Error: {error}</p>
      ) : data.length > 0 ? (
        // If data is available, render an unordered list with data items
        <ul>
          {data.map((item) => (
            // Map over each data item and display it as a list item with a unique key
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        // If no data is available, render a message indicating no data
        <p>No data available</p>
      )}
    </div>
  );
}

// Export the 'App' component as the default export
export default App;
