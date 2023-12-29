// WordsContext.js == WordsContext.js
import { createContext, useContext, useState } from 'react';

const WordsContext = createContext();

// const WordsContextProvider = ({ children }) => {
//   const [myData, setMyData] = useState(0);

//   const updateContext = newData => {
//     setMyData(newData);
//   };

//   return (
//     <WordsContext.Provider value={{ myData, updateContext }}>
//       {children}
//     </WordsContext.Provider>
//   );
// };

// const useWordsContext = () => {
//   return useContext(WordsContext);
// };

export default WordsContext;
