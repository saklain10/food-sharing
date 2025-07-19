import { useRouteError } from "react-router";
import Header from "../components/Header";

const Error = () => {
  const error = useRouteError();
  console.log(error);
  return (
    <div>
      <Header></Header>
      <div className="flex min-h-screen items-center justify-center">Error</div>
    </div>
  );
};

export default Error;
