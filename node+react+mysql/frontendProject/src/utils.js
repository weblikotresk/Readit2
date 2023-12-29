export default function getBeautifulDate(timestamp = new Date(0)){
    let months = [
        'января', 'февраля', 'марта',
        'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября',
        'октября', 'ноября', 'декабря'
    ];
    // Получаем день, месяц и год
    let day = timestamp.getDate();
    let monthIndex = timestamp.getMonth();
    let year = timestamp.getFullYear();
    
    // Формируем строку с датой в нужном формате
    return day + ' ' + months[monthIndex] + ' ' + year
}

export function ErrorHandler(err){
    if(err.status == 403){

    }
}