const isInteger = value => {
    return /^\d+$/.test(value);
}

const TimeProcess = {
    unit: {
        w: {
            time: 604800,
            total: 0
        },
        d: {
            time: 86400,
            total: 0
        },
        h: {
            time: 3600,
            total: 0,
        },
        m: {
            time: 60,
            total: 0,
        },
        s: {
            time: 1,
            total: 0,
        }
    },
    toString(){
        let result = '';

        for(let item in this.unit){
            if (this.unit[item].total > 0)
                result += `${this.unit[item].total}${item} `;
        }
        return result.trim();
    },
    validateTime(value){
        this.reset();
        let split = value.split(' ');

        split = split.map(item => item.trim()).filter(item => !!item);


        for(let i = 0; i < split.length; ++i){
            let item = split[i].split('');

            const unitItem = item.pop();

            if (!this.unit[unitItem]) return undefined;

            item = item.join('');

            if (!isInteger(item)) return undefined;

            this.unit[unitItem].total = parseInt(item);
        }

        let result = 0;

        for(let item in this.unit) {
            const {time,total} = this.unit[item];
            result += time*total;
        }

        return result;
    },
    convertTime(value){
        if (!isInteger(value)) return undefined;

        for(let item in this.unit) {
            this.unit[item].total = Math.floor(value / this.unit[item].time);
            value -= this.unit[item].total*this.unit[item].time;
        }

        return this.toString();
    },
    reset(){
        for(let item in this.unit){
            this.unit[item].total = 0;
        }
    }
}

export default TimeProcess;