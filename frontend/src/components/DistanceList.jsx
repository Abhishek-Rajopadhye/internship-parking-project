function DistanceList({ newMarker, distances }) {
  if (!newMarker || Object.keys(distances).length === 0) return null;

  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Distances from {newMarker.name}:</h3>
      <ul>
        {Object.entries(distances).map(([markerName, distance]) => (
          <li key={markerName}>
            <strong>{markerName}:</strong> {distance} km
          </li>
        ))}
      </ul>
    </div>
  );
}

export { DistanceList };
