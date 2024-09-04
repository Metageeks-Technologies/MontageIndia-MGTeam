import { ThreeDots } from "react-loader-spinner";

export const ThreeDotsLoader = () => {
  return (
    <div className="flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="20"
        width="40"
        color="#fff"
        radius="9"
        ariaLabel="three-dots-loading"
      />
    </div>
  );
};


