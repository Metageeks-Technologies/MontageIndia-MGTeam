import { ThreeDots,Vortex } from "react-loader-spinner";

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

export const SpinnerLoader = () => {
  return (
    <div className="flex min-h-fit justify-center items-center">
      <Vortex
        visible={true}
        height="50"
        width="50"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={['#df4041','#8e519a','#43a5d0', '#bbd249' , '#f1e135', '#eda21e' ]}
        />
    </div>
  );
}


