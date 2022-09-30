class APIFeatures{

    constructor(query, queryStr){
        this.query=query,
        this.queryStr=queryStr
    }

    filter(){
    const queryObj = {...this.queryStr}
    const exlcudeFields=['page', 'sort', 'limit', 'fields']
    exlcudeFields.forEach(item=> delete queryObj[item])

    let queryString= JSON.stringify(queryObj);
    queryString= queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query=this.query.find(JSON.parse(queryString))

    return this
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy= this.queryStr.sort.replace(',',' ')
            this.query=this.query.sort(sortBy)
        }
        else this.query=this.query.sort('createdAt')

        return this
    }

    fields(){
        if(this.queryStr.fields){
            const fields= this.queryStr.fields.replace(',',' ')
            this.query=this.query.select(fields)
        }else this.query=this.query.select('-__v')

        return this
    }

    paginator(){
        const page=this.queryStr.page *1 || 1;
        const limit = this.queryStr.limit *1 || 10;
    
        const skip=(page-1)*limit;
    
        this.query=this.query.skip(skip).limit(limit)

        return this
    }
}

export default APIFeatures