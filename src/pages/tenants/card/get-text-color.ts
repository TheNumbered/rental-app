export default function getColorFromText(text: string){
    const colors = [
        "#ff9c6e",// Peach
        "#ff7875",// Salmon
        "#ffc069",// Apricot
        "#ffd666",// Goldenrod
        "#fadb14",// Saffron
        "#95de64",// Pastel Green
        "#5cdbd3",
        "#69c0ff",
        "#85a5ff",
        "#b37feb",
        "#ff85c0",
    ];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    hash = ((hash % colors.length) + colors.length) % colors.length;

    return colors[hash];
};
