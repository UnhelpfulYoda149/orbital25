import React, { useEffect, useState } from "react";
import Header from "../components/Header";

function HomePage() {
  const username = localStorage.getItem("username"); // or whatever key you're using

  return (
    <div>
      <Header user={username} />
      <main>
        {/* Your homepage content here */}
        <h2>This is the homepage content.</h2>
      </main>
    </div>
  );
}

export default HomePage;
