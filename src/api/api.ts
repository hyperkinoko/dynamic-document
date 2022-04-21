const getDocument = async(queryId: string) => {
    const response = await fetch(
      `/document.json`
    );
    const data = await response.json();
    for (const document of data) {
        if (document.id === queryId) return document;
    }
}

export default getDocument;