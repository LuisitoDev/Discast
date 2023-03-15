import React, {useState} from 'react';

const SearchContext = React.createContext({
    searchText: '',
    hasChanged: false,
    updateText: ()=>{}
})

export const SearchContextProvider = (props) => {
    const [searchText, setSearchText] = useState('');
    const [hasChanged, setHasChanged] = useState(false);

    const updateText = (text) => {
        setSearchText(text);
        setHasChanged(true);
    }

    

    return <SearchContext.Provider value={{
        searchText: searchText,
        hasChanged: hasChanged,
        updateText : updateText
    }}>
        {props.children}
    </SearchContext.Provider>
}

export default SearchContext;