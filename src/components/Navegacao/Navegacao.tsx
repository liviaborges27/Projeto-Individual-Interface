import { type JSX } from "react";

function Navegacao(): JSX.Element {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            className: 'm-5 text-white text-lg',
            url: "/"
        },
        {
            label: 'Produtos',
            icon: 'pi pi-box',
            className: 'm-5 text-white text-lg',
            url: "/"
        },
        {
            label: 'Categorias',
            icon: 'pi pi-tags',
            className: 'm-5 text-white text-lg',
            url: "/categorias"
        },
        {
            label: 'Movimentações',
            icon: 'pi pi-sync',
            className: 'm-5 text-white text-lg',
            url: "/movimentacoes"   
        }
    ];

    return (
        <header className="card h-[12vh] bg-slate-700 content-center">
            <nav className="flex align-items-center justify-between">
                <img
                    alt="logo"
                    src="/src/assets/app-icon.png"
                    height="100"
                    className="h-20 p-3 ml-10 mr-5 h-[7rem]"
                />
                <div className="flex align-items-center">
                    {items.map((item) => (
                        <a key={item.label} href={item.url} className={item.className}>
                            <i className={`${item.icon} mr-2`} aria-hidden="true" />
                            {item.label}
                        </a>
                    ))}
                </div>
                <div className="flex align-items-center gap-2">
                    <p className="text-white content-center pr-[0.5rem]">InfoTech Admin</p>
                    <img
                        src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                        alt="Avatar de InfoTech Admin"
                        className="rounded-full mr-10 !w-[25%] !h-[25%]"
                    />
                </div>
            </nav>
        </header>
    );
}

export default Navegacao;