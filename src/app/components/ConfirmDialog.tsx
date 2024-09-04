const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete this comment?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Yes
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            No
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
