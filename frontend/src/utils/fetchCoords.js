//function to get coordinates
export const fetchCoords = async (postcode) => {
  try {
    const response = await fetch(
      `http://localhost:3001/coordinates/${postcode}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coordinates", error);
  }
};
