// sa-smart-service-app/src/components/ui/LoaderShowcase.tsx
import LoadingSpinner from "./LoadingSpinner";
import BarLoader from "./BarLoader";
import ClipLoaderSpinner from "./ClipLoaderSpinner";

const LoaderShowcase = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center', margin: 32 }}>
    <div>
      <div>Spinner Loader (CSS)</div>
      <LoadingSpinner />
    </div>
    <div>
      <div>Bar Loader (CSS)</div>
      <BarLoader />
    </div>
    <div>
      <div>ClipLoader (react-spinners)</div>
      <ClipLoaderSpinner />
    </div>
  </div>
);

export default LoaderShowcase;