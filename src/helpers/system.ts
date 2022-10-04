export async function whait(sec: number) {
    return new Promise((res, rej) => {
        setTimeout(res, sec);
    })
}