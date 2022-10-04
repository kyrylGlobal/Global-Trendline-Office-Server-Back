import fs from 'fs';

interface OnWriteFileUpdateDataFunction {
    (data: string): string;
}

class Files{
    async appendFile(path: string, data: string) {
        return new Promise((resolve, reject) => {
            fs.appendFile(path, data, (error) => {
                if(error){
                    reject(`Problem with request log write data to file! File path - ${path}`);
                }

                resolve(true);
            })
        })
    }

    async readFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {encoding: 'utf8'}, (error, data) => {
                if(error) {
                    reject(error);
                }
                resolve(data);
            })
        })
    }

    readFileSync(path: string): string {
        return fs.readFileSync(path, {encoding: "utf8"});
    }

    writeFileSync(path: string, data: string) {
        fs.writeFileSync(path, data, {encoding: "utf8"});
    }
}

export default new Files();