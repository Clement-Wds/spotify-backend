// Importation des hooks et utilitaires de React et d'autres dépendances
import {useEffect, useRef, useState} from 'react'; 
import './index.css'; // Importation du fichier CSS pour le style
import axios from 'axios'; // Importation d'axios pour effectuer des requêtes HTTP

// Définition du composant Search
const SearchArtist = () => {
  // Déclaration des états pour gérer les données de l'entrée utilisateur, les données récupérées, et l'état de chargement
  const [input, setInput] = useState(''); // Gère la valeur de l'input de recherche
  const [data, setData] = useState([]); // Stocke les données récupérées de l'API
  const [isLoading, setIsLoading] = useState(false); // Indique si une requête est en cours
  const callRef = useRef(null); // Référence pour gérer les appels d'API décalés (debouncing)

  // useEffect se déclenche à chaque modification de l'entrée utilisateur
  useEffect(() => {
    if (input.length > 0) { // Vérifie si l'input n'est pas vide
      setIsLoading(true); // Commence le chargement
      clearTimeout(callRef.current); // Annule le précédent appel d'API planifié
      callRef.current = setTimeout(() => { // Planifie un nouvel appel d'API après un délai
        axios({
          method: 'GET',
          url: `https://api.muslimin-play.com/artists?name_contains=${input}`,
        })
          .then(res => { // Traitement de la réponse de l'API
            setIsLoading(false); // Arrête le chargement
            console.log(res.data); // Affiche les données récupérées dans la console
            setData(res.data); // Met à jour l'état avec les données récupérées
          })
          .catch(err => { // Gestion des erreurs
            setIsLoading(false); // Arrête le chargement en cas d'erreur
            console.log(err); // Affiche l'erreur dans la console
          });
      }, 300); // Délai de 300 ms avant l'exécution de l'appel API
    }
  }, [input]); // Dépendance à l'entrée utilisateur pour déclencher useEffect

  // Rendu du composant
  return (
    <div style={{...}}> // Style du conteneur principal
      <input
        onChange={e => setInput(e.target.value)} // Met à jour l'état de l'entrée à chaque changement
        value={input} // Valeur de l'entrée liée à l'état 'input'
        style={{...}} // Style de l'élément input
        type="text"
        placeholder="Search..."
      />
      <div style={{...}}> // Conteneur pour les résultats de recherche et le spinner de chargement
        {isLoading ? <div className="spinner"></div> : null} // Affiche le spinner si chargement en cours
        {data
          .map((item, index) => ( // Cartographie des données en éléments visuels
            <div key={index} style={{...}}>
              {item.name} // Affiche le nom de chaque élément de données
            </div>
          ))
          .slice(0, 5)} // Limite les résultats affichés à 5
      </div>
    </div>
  );
};

export default SearchArtist; 