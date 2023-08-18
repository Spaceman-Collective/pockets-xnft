import Toast from './Toast';

const ToastsContainer = ({ toasts, position = "bottom-right" }) => {
  return (
    <div className={`toasts-container ${position}`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastsContainer;
