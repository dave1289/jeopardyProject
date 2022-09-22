async function randQuestion(value) {
    const res = await axios.get(`https://jservice.io/api/clues/values?${value}`)
    const data = res.data[0]
    console.log(data.answer, res, data.question)
}

$(".card").on('click', function(e){
    const value = e.target.data('value')
    randQuestion(value);
})