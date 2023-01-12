export enum regEx {
    "input-name" = "^\\s*?[A-Za-z]{3,25}\\s+[A-Za-z]{3,25}\\s*?$",
    "input-tel" = "^[+]{1}\\d{9,15}$",
    "input-address" = "^\\s*?[A-Za-z]{5,25}\\s+[A-Za-z]{5,25}\\s+[A-Za-z]{5,25}\\s*?$",
    "input-email" = "^[A-Za-z0-9.-]+@[A-Za-z]+.[A-Za-z]{2,4}$",
    "input-card-number" = "^\\s*?[4-6]{1}\\d{3}\\s*\\d{4}\\s*\\d{4}\\s*\\d{4}\\s*?$",
    // "input-valid-thru" = "^(0{1}[1-9]{1})|(1{1}[0-2]{1})$",
    "input-valid-thru" = "^0[1-9]|1[0-2]/2[3-9]$",
    "input-cvv-code" = "^\\d{3}$",
}
