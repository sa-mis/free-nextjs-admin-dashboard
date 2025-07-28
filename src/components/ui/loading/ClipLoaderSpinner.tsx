// sa-smart-service-app/src/components/ui/ClipLoaderSpinner.tsx
import { ClipLoader } from "react-spinners";

const ClipLoaderSpinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px'
  }}>
    <ClipLoader color="#6366f1" size={60} />
  </div>
);
export default ClipLoaderSpinner;