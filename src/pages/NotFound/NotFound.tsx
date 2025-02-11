import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry we couldn't find that page</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default NotFound;
