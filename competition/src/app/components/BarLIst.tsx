export default function BarList() {
  const items = [
    {
      id: 1,
      label:
        "Un concours organiser par l'EMIFI, c'est un concours pour la l'hymne nationale de l'EMIT",
    },
    {
      id: 2,
      label:
        "Lors de l'ajout des fichiers, vous aller recevoir votre identifiant, veuiller ne pas le perdre",
    },
    {
      id: 3,
      label:
        "Le gagnant sera annoncer par son identifant dans la page de l'EMIFI",
    },
  ];

  return (
    <div className="flex flex-col items-start relative">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-start space-x-4 opacity-0 animate-fade-in`}
          style={{ animationDelay: `${index * 500}ms` }}
        >
          <div className="flex flex-col items-center">
            <span className="w-3 lg:w-6 md:w-4 h-3 lg:h-6 md:h-4 bg-blue-500 rounded-full"></span>

            {index !== items.length - 1 && (
              <div className="w-1 lg:w-2 md:w-1 bg-gray-400 h-10 md:h-20"></div>
            )}
          </div>

          <span className="text-gray-800 text-sm font-bold lg:text-2xl md:text-xl leading-4 md:leading-7">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
