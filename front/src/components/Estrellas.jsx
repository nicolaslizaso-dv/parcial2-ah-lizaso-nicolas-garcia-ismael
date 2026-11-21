export default function Estrellas({ puntaje }) {
    const redondeado = Math.round(puntaje)
    return (
        <span className="estrellas" aria-label={`${puntaje} de 5`}>
            {"★".repeat(redondeado) + "☆".repeat(5 - redondeado)}
        </span>
    )
}
