
const validNewsCategory= (news)=>{
    return news && news.category && typeof news.category === 'string' && news.category.trim() !== '';
}

const validNewsCategoryToClient = (news) => {
    return news.map((item) => {
        return {
            id: item.id,
            category: item.category,
            image: item.image,
        }
    })
}



module.exports = {
    validNewsCategory,
    validNewsCategoryToClient
}