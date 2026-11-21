export default function Etiquetas({ etiquetas }) {
    return (
        <p className="mb-1">
            {etiquetas.map(etiqueta => <span key={etiqueta} className="etiqueta">{etiqueta}</span>)}
        </p>
    )
}
