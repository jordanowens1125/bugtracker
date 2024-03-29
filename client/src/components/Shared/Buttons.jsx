const Buttons = ({ secondary, submit, secondaryFunction, disabled }) => {
  return (
    <div className="flex mobile-justify-right p-sm">
      {secondary && (
        <button
          className="button-secondary"
          onClick={secondaryFunction}
          type="button"
        >
          {secondary}
        </button>
      )}
      {submit && (
        <button className="button-primary" type="submit" disabled={disabled}>
          {submit}
        </button>
      )}
    </div>
  );
};

export default Buttons;
