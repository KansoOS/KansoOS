// Icônes SVG inline, volontairement minimalistes (trait simple, pas de
// remplissage) pour rester cohérentes avec le reste de l'interface, et sans
// ajouter de dépendance juste pour quelques pictogrammes.
import type { SVGProps } from 'react';

function iconProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
    return {
        width: 20,
        height: 20,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        ...props,
    };
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M12 3 4.5 5.5v6c0 5 3.3 7.8 7.5 9.5 4.2-1.7 7.5-4.5 7.5-9.5v-6z" />
            <path d="m9 12 2 2 4-4.5" />
        </svg>
    );
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" />
            <path d="M14 10h5a1 1 0 0 1 1 1v10" />
            <path d="M8 9h1M8 13h1M8 17h1" />
            <path d="M4 21h16" />
        </svg>
    );
}

function ScrollIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M7 3h10a1 1 0 0 1 1 1v15a2 2 0 1 1-4 0V5" />
            <path d="M7 3a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10" />
            <path d="M10 8h4M10 12h4" />
        </svg>
    );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <rect x="6" y="2" width="12" height="20" rx="2" />
            <path d="M11 18h2" />
        </svg>
    );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function TrashIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M4 7h16" />
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
        </svg>
    );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.3 2.3 4.7-5" />
        </svg>
    );
}

function AlertIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...iconProps(props)}>
            <path d="M12 3 2 20h20z" />
            <path d="M12 10v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}

export {
    ShieldIcon,
    LogoutIcon,
    BuildingIcon,
    ScrollIcon,
    LockIcon,
    PhoneIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    AlertIcon,
};
