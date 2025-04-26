
import HvacForm from "@/components/HvacForm";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 transition">
      <div className="absolute inset-0 bg-[linear-gradient(109.6deg,_rgba(223,234,247,1)_11.2%,_rgba(244,248,252,1)_91.1%)] pointer-events-none select-none" aria-hidden />
      <div className="relative z-10 w-full max-w-2xl flex flex-col justify-center items-center py-12 px-2">
        {/* Fulmark Branding */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/fulmark-logo.webp"
            alt="Fulmark Klimatyzacja logo"
            className="h-16 mb-2 drop-shadow-md max-w-[190px] object-contain"
          />
          <h2 className="font-montserrat text-3xl font-black text-sky-700 tracking-tight drop-shadow-sm">
            
          </h2>
        </div>
        {/* Main Header */}
        <h1 className="font-montserrat text-3xl md:text-4xl font-black text-blue-900 mb-6 drop-shadow-xl text-center">
          Formularz kontaktowy 
        </h1>
        <p className="mb-10 text-blue-800/80 text-lg max-w-xl text-center font-playfair">
          Wypełnij prosty formularz, a my wrócimy do Ciebie z odpowiedzią tak szybko, jak tylko złapiemy powiew świeżego powietrza!
        </p>
        <HvacForm />
        <p className="mt-8 text-xs text-gray-400 text-center">© {new Date().getFullYear()} Fulmark · Design lekki jak powietrze ☁️</p>
      </div>
    </div>
  );
};

export default Index;
