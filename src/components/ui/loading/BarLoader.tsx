// sa-smart-service-app/src/components/ui/BarLoader.tsx
const BarLoader = () => (
    <div className="bar-loader">
      <div></div><div></div><div></div><div></div>
      <style jsx>{`
        .bar-loader {
          display: flex;
          gap: 4px;
          height: 40px;
          align-items: end;
          justify-content: center;
        }
        .bar-loader div {
          width: 8px;
          height: 100%;
          background: #6366f1;
          animation: bar 1s infinite alternate;
        }
        .bar-loader div:nth-child(2) { animation-delay: 0.2s;}
        .bar-loader div:nth-child(3) { animation-delay: 0.4s;}
        .bar-loader div:nth-child(4) { animation-delay: 0.6s;}
        @keyframes bar {
          0% { height: 20%;}
          100% { height: 100%;}
        }
      `}</style>
    </div>
  );
  export default BarLoader;