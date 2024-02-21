import AdminEdit from "@components/AdminEdit/AdminEdit";
import Visitor from "@components/Visitor/Visitor";

interface VisitModalProps {
  onClose: () => void; // A function to close the modal
}

const VisitModal = ({ onClose }: VisitModalProps) => {
  return <Visitor onClose={onClose} />;
};

export default VisitModal;
