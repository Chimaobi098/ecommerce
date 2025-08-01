import React from "react";

const dummyApps = [
  {
    id: 1,
    name: "Seidou Video",
    thumbnail: "https://via.placeholder.com/300x160?text=Sidan+Video",
  },
  {
    id: 2,
    name: "Seidou Social",
    thumbnail: "https://via.placeholder.com/300x160?text=Sidan+Social",
  },
];

const AppsGallery: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {dummyApps.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <img
            src={app.thumbnail}
            alt={app.name}
            style={{
              width: "100%",
              height: "300px",
              //   height: "auto",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              padding: "1rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "black",
            }}
          >
            {app.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppsGallery;
