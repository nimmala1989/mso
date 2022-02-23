import date from 'date-and-time'

export class CommonActions {

    static randomString(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    static getTodayDate(format: string = "MM/DD/YYYY") {
        const now = new Date()
        return date.format(now, format)
    }

    static getFutureDate(by: "Days" | "Months" | "Years", value: number, format: string = "MM/DD/YYYY"): string {
        const now = new Date()
        switch (by) {
            case "Days":
                return this.formatDate(date.addDays(now, value), format).toString()
            case "Months":
                return this.formatDate(date.addMonths(now, value), format).toString()
            case "Years":
                return this.formatDate(date.addYears(now, value), format).toString()
        }
    }

    static formatDate(dateToFormat: string | Date, format: string = "MM/DD/YYYY") {
        if (typeof dateToFormat == 'string') {
            return date.parse(dateToFormat, format)
        }
        else if (dateToFormat instanceof Date) {
            return date.format(dateToFormat, format)
        }
    }
}
