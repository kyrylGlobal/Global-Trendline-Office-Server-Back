import fs from 'fs';

class Files{
    async appendFile(path: string, data: string){
        return new Promise((resolve, reject) => {
            fs.appendFile(path, data, (error) => {
                if(error){
                    reject(`Problem with request log write data to file! File path - ${path}`);
                }

                resolve(true);
            })
        })
    }
}

export default new Files();