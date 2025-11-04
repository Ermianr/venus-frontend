import Image from "next/image";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh p-8 flex flex-col items-center justify-center gap-6">
      <div className="flex gap-1 items-center justify-center">
        <Image src="/logo.svg" height={40} width={40} alt="Logo venus" />
        <p className="font-medium text-3xl">VENUS</p>
      </div>
      <div className="w-full md:max-w-xl">{children}</div>
    </div>
  );
}
export default Layout;
