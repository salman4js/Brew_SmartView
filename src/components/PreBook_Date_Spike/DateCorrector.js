function retrieveDate(){
    const current = new Date();
    if(current.getDate().length > 1){
        const date = `${current.getFullYear()}/${current.getMonth()+1}/${current.getDate()}`;
        return date
    } else {
        const date = `${current.getFullYear()}/${current.getMonth()+1}/${"0"+current.getDate()}`;
        return date
    }
}


export default retrieveDate;