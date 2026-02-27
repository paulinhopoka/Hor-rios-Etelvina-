import { ScheduleData, ShiftData, DaySchedule, Lesson } from './types';

export const timeBounds = {
    manha: [
        { start: "07:15", end: "08:00" },
        { start: "08:00", end: "08:45" },
        { start: "08:45", end: "09:30" },
        { start: "09:30", end: "09:45", isInterval: true },
        { start: "09:45", end: "10:30" },
        { start: "10:30", end: "11:15" },
        { start: "11:15", end: "12:00" }
    ],
    tarde: [
        { start: "12:45", end: "13:30" },
        { start: "13:30", end: "14:15" },
        { start: "14:15", end: "15:00" },
        { start: "15:00", end: "15:15", isInterval: true },
        { start: "15:15", end: "16:00" },
        { start: "16:00", end: "16:45" },
        { start: "16:45", end: "17:20" }
    ]
};

export const rawManha: Record<string, Record<string, string[][]>> = {
    "801": { "Segunda": [["RPM", ""], ["RPM", ""], ["PORTUGUÊS", "Andreia"], ["INT"], ["RELIGIÃO", "Cynthia"], ["PORTUGUÊS", "Andreia"], ["PORTUGUÊS", "Andreia"]], "Terça": [["Inglês", ""], ["Geografia", "Adriane"], ["Inglês", ""], ["INT"], ["PORTUGUÊS", "Andreia"], ["LPT", "Andreia"], ["LPT", "Andreia"]], "Quarta": [["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"], ["MATEMÁTICA", "Cynthia M."], ["INT"], ["MATEMÁTICA", "Cynthia M."], ["ARTES", "Victor"], ["ARTES", "Victor"]], "Quinta": [["MATEMÁTICA", "Cynthia M."], ["HISTÓRIA", "Eugênio"], ["CIÊNCIAS", "Simone"], ["INT"], ["CIÊNCIAS", "Simone"], ["MATEMÁTICA", "Cynthia M."], ["MATEMÁTICA", "Cynthia M."]], "Sexta": [["CIÊNCIAS", "Simone"], ["CIÊNCIAS", "Simone"], ["Geografia", "Adriane"], ["INT"], ["Geografia", "Adriane"], ["Ed.FÍSICA", "Alvaro"], ["Ed.FÍSICA", "Alvaro"]] },
    "901": { "Segunda": [["LPT", "Aline"], ["LPT", "Aline"], ["RELIGIÃO", "Cynthia"], ["INT"], ["PORTUGUÊS", "Andreia"], ["ARTE", ""], ["ARTE", ""]], "Terça": [["PORTUGUÊS", "Andreia"], ["PORTUGUÊS", "Andreia"], ["PORTUGUÊS", "Andreia"], ["INT"], ["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"]], "Quarta": [["MATEMÁTICA", "Cynthia M."], ["MATEMÁTICA", "Cynthia M."], ["HISTÓRIA", "Eugênio"], ["INT"], ["HISTÓRIA", "Eugênio"], ["RPM", "Cynthia M."], ["RPM", "Cynthia M."]], "Quinta": [["HISTÓRIA", "Eugênio"], ["MATEMÁTICA", "Cynthia M."], ["MATEMÁTICA", "Cynthia M."], ["INT"], ["MATEMÁTICA", "Cynthia M."], ["INGLÊS", "Estela"], ["INGLÊS", "Estela"]], "Sexta": [["Ciências", "Déborah"], ["Ciências", "Déborah"], ["Ed.FÍSICA", "Alvaro"], ["INT"], ["Ed.FÍSICA", "Alvaro"], ["Ciências", "Déborah"], ["Ciências", "Déborah"]] },
    "1001": { "Segunda": [["Espanhol", "Andreia"], ["RELIGIÃO", "Cynthia"], ["Ling. e Mov", "Adriane"], ["INT"], ["Ling. e Mov", "Adriane"], ["MATEMÁTICA", "Mônica"], ["MATEMÁTICA", "Mônica"]], "Terça": [["MATEMÁTICA", "Mônica"], ["MATEMÁTICA", "Mônica"], ["PORTUGUÊS", "Leones."], ["INT"], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."]], "Quarta": [["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"], ["QUÍMICA", "Mônica"], ["INT"], ["QUÍMICA", "Mônica"], ["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"]], "Quinta": [["FILOSOFIA", "Andreia"], ["FILOSOFIA", "Andreia"], ["INGLÊS", "Estela"], ["INT"], ["INGLÊS", "Estela"], ["BIOLOGIA", "Simone"], ["BIOLOGIA", "Simone"]], "Sexta": [["Ed.FÍSICA", "Alvaro"], ["Ed.FÍSICA", "Alvaro"], ["SOCIOLOGIA APLI.", "Iolanda"], ["INT"], ["SOCIOLOGIA APLI.", "Iolanda"], ["FÍSICA", "Natália"], ["FÍSICA", "Natália"]] },
    "1002": { "Segunda": [["RELIGIÃO", "Cynthia"], ["Espanhol", "Andreia"], ["MATEMÁTICA", "Mônica"], ["INT"], ["MATEMÁTICA", "Mônica"], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."]], "Terça": [["PORTUGUÊS", "Leones."], ["HISTÓRIA", "Eugênio"], ["INGLÊS", "Estela"], ["INT"], ["INGLÊS", "Estela"], ["MATEMÁTICA", "Mônica"], ["MATEMÁTICA", "Mônica"]], "Quarta": [["FILOSOFIA", "Andreia"], ["FILOSOFIA", "Andreia"], ["GEOGRAFIA", "Lucília"], ["INT"], ["GEOGRAFIA", "Lucília"], ["QUÍMICA", "Mônica"], ["QUÍMICA", "Mônica"]], "Quinta": [["Ed.FÍSICA", "Alvaro"], ["Ed.FÍSICA", "Alvaro"], ["HISTÓRIA", "Eugênio"], ["INT"], ["Mat. e o uso das tec", ""], ["Mat. e o uso das tec", ""], ["PORTUGUÊS", "Leones."]], "Sexta": [["SOCIOLOGIA APLI.", "Iolanda"], ["SOCIOLOGIA APLI.", "Iolanda"], ["FÍSICA", "Natália"], ["INT"], ["FÍSICA", "Natália"], ["BIOLOGIA", "Simone"], ["BIOLOGIA", "Simone"]] },
    "2000FC": { "Segunda": [["MATEMÁTICA", "Mônica"], ["MATEMÁTICA", "Mônica"], ["PORTUGUÊS", "Leones."], ["INT"], ["PORTUGUÊS", "Leones."], ["Relig./Ref.", "Cynthia A./"], ["Const. Suj. Soci", "Aline"]], "Terça": [["Part. Social", "Adriane"], ["PORTUGUÊS", "Leones."], ["HISTÓRIA", "Eugênio"], ["INT"], ["HISTÓRIA", "Eugênio"], ["INGLÊS", "Estela"], ["INGLÊS", "Estela"]], "Quarta": [["MATEMÁTICA", "Mônica"], ["Part. Social", "Adriane"], ["ARTES", "Victor"], ["INT"], ["ARTES", "Victor"], ["Est Orie.", "Andreia"], ["Química", ""]], "Quinta": [["Geografia", "Adriane"], ["Geografia", "Adriane"], ["Lab. De Ciê. e So apli.", "Adriane"], ["INT"], ["Lab. De Ciê. e So apli.", "Adriane"], ["Ed.FÍSICA", "Alvaro"], ["Ed.FÍSICA", "Alvaro"]], "Sexta": [["FÍSICA", "Natália"], ["FÍSICA", "Natália"], ["BIOLOGIA", "Simone"], ["INT"], ["BIOLOGIA", "Simone"], ["SOCIOLOGIA", "Iolanda"], ["SOCIOLOGIA", "Iolanda"]] },
    "3000FC": { "Segunda": [["Física", "Joabe"], ["Física", "Joabe"], ["PORTUGUÊS", "Aline"], ["INT"], ["PORTUGUÊS", "Aline"], ["PORTUGUÊS", "Aline"], ["Relig./Ref.", "Cynthia A./"]], "Terça": [["INGLÊS", "Estela"], ["INGLÊS", "Estela"], ["MATEMÁTICA", "Mônica"], ["INT"], ["MATEMÁTICA", "Mônica"], ["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"]], "Quarta": [["Sist. Político", "Adriane"], ["MATEMÁTICA", "Mônica"], ["FILOSOFIA", "Andreia"], ["INT"], ["FILOSOFIA", "Andreia"], ["Part. Social", "Lucília"], ["Est Orie.", "Andreia"]], "Quinta": [["BIOLOGIA", "Simone"], ["BIOLOGIA", "Simone"], ["Ed.FÍSICA", "Alvaro"], ["INT"], ["Ed.FÍSICA", "Alvaro"], ["SOCIOLOGIA", "Iolanda"], ["SOCIOLOGIA", "Iolanda"]], "Sexta": [["Geografia", "Adriane"], ["Geografia", "Adriane"], ["Química", ""], ["INT"], ["Química", ""], ["Const. Suj.", "Adriane"], ["Sist. Político", "Adriane"]] }
};

export const rawTarde: Record<string, Record<string, string[][]>> = {
    "601": { "Segunda": [["LPT", "Andreia"], ["LPT", "Andreia"], ["RELIGIÃO", "Cynthia"], ["INT"], ["PORTUGUÊS", "Aline"], ["ARTES", "Victor"], ["ARTES", "Victor"]], "Terça": [["INGLÊS", "Estela"], ["INGLÊS", "Estela"], ["GEOGRAFIA", "Lucília"], ["INT"], ["GEOGRAFIA", "Lucília"], ["PORTUGUÊS", "Aline"], ["PORTUGUÊS", "Aline"]], "Quarta": [["CIÊNCIAS", "Adriana"], ["CIÊNCIAS", "Adriana"], ["GEOGRAFIA", "Lucília"], ["INT"], ["HISTÓRIA", "Iolanda"], ["Ed.FÍSICA", "Eliane"], ["Ed.FÍSICA", "Eliane"]], "Quinta": [["PORTUGUÊS", "Aline"], ["PORTUGUÊS", "Aline"], ["CIÊNCIAS", "Adriana"], ["INT"], ["CIÊNCIAS", "Adriana"], ["MATEMÁTICA", "Natália"], ["MATEMÁTICA", "Natália"]], "Sexta": [["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"], ["MATEMÁTICA", "Natália"], ["INT"], ["MATEMÁTICA", "Natália"], ["RPM", "Adriana"], ["RPM", "Adriana"]] },
    "602": { "Segunda": [["LPT", "Aline"], ["RELIGIÃO", "Cynthia"], ["PORTUGUÊS", "Leones."], ["INT"], ["Ciências", ""], ["PORTUGUÊS", "Leones."], ["LPT", "Aline"]], "Terça": [["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."], ["INT"], ["Arte", ""], ["INGLÊS", "Estela"], ["INGLÊS", "Estela"]], "Quarta": [["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"], ["INT"], ["Ciências", ""], ["Ciências", ""], ["Ciências", ""]], "Quinta": [["Ed.FÍSICA", "Alvaro"], ["Ed.FÍSICA", "Alvaro"], ["Geografia", "Iolanda"], ["INT"], ["Geografia", "Iolanda"], ["Matemática", "Juliana"], ["Matemática", "Juliana"]], "Sexta": [["Arte", ""], ["Matemática", "Juliana"], ["RPM", "Adriana"], ["INT"], ["RPM", "Adriana"], ["LPT", "Aline"], ["LPT", "Aline"]] },
    "701": { "Segunda": [["ARTES", "Victor"], ["ARTES", "Victor"], ["Ed.FÍSICA", "Eliane"], ["INT"], ["Ed.FÍSICA", "Eliane"], ["PORTUGUÊS", "Aline"], ["RELIGIÃO", "Cynthia"]], "Terça": [["PORTUGUÊS", "Aline"], ["PORTUGUÊS", "Aline"], ["INGLÊS", "Estela"], ["INT"], ["INGLÊS", "Estela"], ["Matemática", "Juliana"], ["Matemática", "Juliana"]], "Quarta": [["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"], ["CIÊNCIAS", "Adriana"], ["INT"], ["CIÊNCIAS", "Adriana"], ["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"]], "Quinta": [["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"], ["PORTUGUÊS", "Aline"], ["INT"], ["PORTUGUÊS", "Aline"], ["CIÊNCIAS", "Adriana"], ["CIÊNCIAS", "Adriana"]], "Sexta": [["RPM", "Adriana"], ["RPM", "Adriana"], ["Matemática", "Juliana"], ["INT"], ["Matemática", "Juliana"], ["LPT", "Aline"], ["LPT", "Aline"]] },
    "702": { "Segunda": [["Arte", ""], ["PORTUGUÊS", "Leones."], ["LPT", "Andreia"], ["INT"], ["RELIGIÃO", "Cynthia"], ["LPT", "Andreia"], ["Arte", ""]], "Terça": [["GEOGRAFIA", "Lucília"], ["Ciências", "Déborah"], ["Ciências", "Déborah"], ["INT"], ["Ciências", "Déborah"], ["Inglês", ""], ["Inglês", ""]], "Quarta": [["Ed.FÍSICA", "Eliane"], ["Ed.FÍSICA", "Eliane"], ["Matemática", "Adriane"], ["INT"], ["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"], ["HISTÓRIA", "Iolanda"]], "Quinta": [["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."], ["INT"], ["PORTUGUÊS", "Leones."], ["HISTÓRIA", "Iolanda"], ["HISTÓRIA", "Iolanda"]], "Sexta": [["RPM", "Juliana"], ["Ciências", "Déborah"], ["Matemática", ""], ["INT"], ["Matemática", ""], ["Matemática", ""], ["RPM", "Juliana"]] },
    "802": { "Segunda": [["RELIGIÃO", "Cynthia"], ["LPT", "Aline"], ["LPT", "Aline"], ["INT"], ["PORTUGUÊS", "Leones."], ["Ed.FÍSICA", "Eliane"], ["PORTUGUÊS", "Leones."]], "Terça": [["Ciências", "Déborah"], ["MATEMÁTICA", "Natália"], ["MATEMÁTICA", "Natália"], ["INT"], ["MATEMÁTICA", "Natália"], ["Ciências", "Déborah"], ["Ciências", "Déborah"]], "Quarta": [["ARTES", "Victor"], ["ARTES", "Victor"], ["Ed.FÍSICA", "Eliane"], ["INT"], ["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"]], "Quinta": [["INGLÊS", "Estela"], ["INGLÊS", "Estela"], ["MATEMÁTICA", "Natália"], ["INT"], ["MATEMÁTICA", "Natália"], ["PORTUGUÊS", "Leones."], ["PORTUGUÊS", "Leones."]], "Sexta": [["Ciências", "Déborah"], ["RPM", ""], ["Geografia", "Iolanda"], ["INT"], ["Geografia", "Iolanda"], ["Geografia", "Iolanda"], ["RPM", ""]] },
    "902": { "Segunda": [["RPM", "Mônica"], ["RPM", "Mônica"], ["ARTES", "Victor"], ["INT"], ["ARTES", "Victor"], ["RELIGIÃO", "Cynthia"], ["Ed.FÍSICA", "Eliane"]], "Terça": [["MATEMÁTICA", "Natália"], ["GEOGRAFIA", "Lucília"], ["PORTUGUÊS", "Aline"], ["INT"], ["PORTUGUÊS", "Aline"], ["GEOGRAFIA", "Lucília"], ["GEOGRAFIA", "Lucília"]], "Quarta": [["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"], ["HISTÓRIA", "Eugênio"], ["INT"], ["Ed.FÍSICA", "Eliane"], ["CIÊNCIAS", "Adriana"], ["CIÊNCIAS", "Adriana"]], "Quinta": [["CIÊNCIAS", "Adriana"], ["CIÊNCIAS", "Adriana"], ["INGLÊS", "Estela"], ["INT"], ["INGLÊS", "Estela"], ["PORTUGUÊS", "Aline"], ["PORTUGUÊS", "Aline"]], "Sexta": [["MATEMÁTICA", "Natália"], ["MATEMÁTICA", "Natália"], ["LPT", "Aline"], ["INT"], ["LPT", "Aline"], ["MATEMÁTICA", "Natália"], ["MATEMÁTICA", "Natália"]] }
};

function buildSchedule(rawObj: any, targetObj: any) {
    for (let cls in rawObj) {
        targetObj[cls] = {};
        for (let day in rawObj[cls]) {
            targetObj[cls][day] = rawObj[cls][day].map((item: any, index: number) => {
                if (item[0] === "INT") return { s: "INTERVALO", t: "", state: "interval", hidden: false, origIdx: index };
                return { s: item[0], t: item[1] || "", state: "normal", hidden: false, tempS: null, tempT: null, origIdx: index };
            });
        }
    }
}

const manhaSchedules = {};
buildSchedule(rawManha, manhaSchedules);

const tardeSchedules = {};
buildSchedule(rawTarde, tardeSchedules);

export const factoryData: ScheduleData = {
    config: { schoolName: "Escola Estadual Etelvina Schottz", theme: "dark" },
    shifts: {
        "manha": {
            times: ["07:15", "08:00", "08:45", "09:30 às 09:45", "09:45", "10:30", "11:15"],
            classesList: ["801", "901", "1001", "1002", "2000FC", "3000FC"],
            schedules: manhaSchedules
        },
        "tarde": {
            times: ["12:45", "13:30", "14:15", "15:00 às 15:15", "15:15", "16:00", "16:45"],
            classesList: ["601", "602", "701", "702", "802", "902"],
            schedules: tardeSchedules
        }
    }
};
