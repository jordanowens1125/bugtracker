const Loading = ({ isLoading }) => {
  return (
    <div className="h-xs">
      {isLoading && <div className="loader"></div>}
    </div>
  );
};

export default Loading;
