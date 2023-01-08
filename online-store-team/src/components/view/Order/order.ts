/* eslint-disable @typescript-eslint/no-non-null-assertion */
import orderHtml from "./order.html";
import { app } from "../../../index";
import "./order.css";
import { regEx } from "../../model/type/orderEnum";
import _default from "../../../assets/img/Order/default.jpg";
import visa from "../../../assets/img/Order/visa.jpg";
import mastercard from "../../../assets/img/Order/mastercard.jpg";
import maestro from "../../../assets/img/Order/maestro.jpg";

export default class OrderView {
    private static regEx = Object(regEx);
    public drawOrder(): void {
        const popUp = document.getElementById("pop-up") as HTMLDivElement;
        if (!popUp) {
            const root = document.getElementById("root") as HTMLDivElement;
            root!.insertAdjacentHTML("beforeend", orderHtml);

            const popUp = document.getElementById("pop-up") as HTMLDivElement;
            const closeButton = document.getElementById("close-button") as HTMLFormElement;

            popUp!.addEventListener("click", this.closePopUp);
            closeButton!.addEventListener("click", this.closePopUp);
        } else {
            popUp!.classList.remove("element_invisible");
        }
        this.setFormEventHandlers();
    }
    private closePopUp(event: Event) {
        event.stopPropagation();
        const clickedElement = event.target! as HTMLElement;
        if (clickedElement.classList.contains("pop-up") || clickedElement.classList.contains("close-button")) {
            const inputFields = Array.from(document.querySelectorAll(".input-field")) as HTMLInputElement[];
            inputFields.forEach((item) => {
                item.classList.remove("input-field_valid");
                item.classList.remove("input-field_invalid");
            });
            const order = document.getElementById("order") as HTMLFormElement;
            order!.reset();
            const popUp = document.getElementById("pop-up") as HTMLDivElement;
            popUp!.classList.add("element_invisible");
        }
    }
    private setFormEventHandlers() {
        const orderForm = document.getElementById("order") as HTMLFormElement;
        const fieldsetCardDetails = document.getElementById("input-card-number") as HTMLFormElement;
        const inputValidThru = document.getElementById("input-valid-thru") as HTMLFormElement;
        const inputCvvCode = document.getElementById("input-cvv-code") as HTMLFormElement;
        orderForm.addEventListener("focusout", this.checkInputValueValidity);
        fieldsetCardDetails.addEventListener("keydown", this.addSpacesAfterCardDigitBlocks);
        fieldsetCardDetails.addEventListener("input", this.forbidNotDigitalInput);
        fieldsetCardDetails.addEventListener("input", this.choosePaymentSystem);
        inputValidThru.addEventListener("keydown", this.addSlashAfterDigitBlocks);
        inputValidThru.addEventListener("input", this.correctMonthAndDate);
        inputValidThru.addEventListener("input", this.forbidNotDigitalInput);
        inputCvvCode.addEventListener("input", this.forbidNotDigitalInput);
        orderForm.addEventListener("submit", this.validateFormBeforeSubmitting);
    }

    private checkInputValueValidity(event: Event) {
        const targetElement = event.target as HTMLInputElement;
        const targetElementId = targetElement.id;
        if (targetElementId !== "order-submit") {
            const tempRegEx = new RegExp(OrderView.regEx[targetElementId]);
            const inputFieldValue = targetElement!.value.trim();
            const isValueValid = tempRegEx.test(inputFieldValue);
            if (isValueValid) {
                targetElement.classList.add("input-field_valid");
                targetElement.classList.remove("input-field_invalid");
                targetElement.dataset["validity"] = "true";
            } else {
                targetElement.classList.add("input-field_invalid");
                targetElement.classList.remove("input-field_valid");
                targetElement.dataset["validity"] = "false";
            }
        }
    }

    private addSpacesAfterCardDigitBlocks(event: KeyboardEvent) {
        const targetElement = event.target as HTMLInputElement;
        let inputFieldValue = targetElement!.value;
        const eventKey = event.key;
        if (/^\d{1}$/.test(eventKey) || /^Backspace$/.test(eventKey)) {
            if (
                (inputFieldValue.length === 4 && event.code !== "Backspace") ||
                (inputFieldValue.length === 9 && event.code !== "Backspace") ||
                (inputFieldValue.length === 14 && event.code !== "Backspace")
            ) {
                inputFieldValue += " ";
                targetElement.value = inputFieldValue;
            }
        }
    }

    private forbidNotDigitalInput(event: Event) {
        const targetElement = event.target as HTMLInputElement;
        let inputFieldValue = targetElement!.value;
        const lastChar = inputFieldValue[inputFieldValue.length - 1]!;
        if (!/^\d{1}$/.test(lastChar)) {
            inputFieldValue = inputFieldValue.slice(0, -1);
            targetElement.value = inputFieldValue;
        }
    }

    private choosePaymentSystem(event: Event) {
        const targetElement = event.target as HTMLInputElement;
        let inputFieldValue = targetElement!.value;
        if (inputFieldValue.length === 0) {
            const paycardImage = document.getElementById("paycard-image") as HTMLImageElement;
            paycardImage.src = _default;
        } else if (inputFieldValue.length === 1) {
            const paycardImage = document.getElementById("paycard-image") as HTMLImageElement;
            switch (+inputFieldValue[0]!) {
                case 4:
                    paycardImage.src = visa;
                    break;
                case 5:
                    paycardImage.src = mastercard;
                    break;
                case 6:
                    paycardImage.src = maestro;
                    break;
                default:
                    paycardImage.src = _default;
                    inputFieldValue = inputFieldValue.slice(0, -1);
                    targetElement.value = inputFieldValue;
                    break;
            }
        }
    }

    private addSlashAfterDigitBlocks(event: KeyboardEvent) {
        const targetElement = event.target as HTMLInputElement;
        let inputFieldValue = targetElement!.value;
        const eventKey = event.key;
        if (/^\d{1}$/.test(eventKey) || /^Backspace$/.test(eventKey)) {
            if (inputFieldValue.length === 2 && event.code !== "Backspace") {
                inputFieldValue += "/";
                targetElement.value = inputFieldValue;
            }
        }
    }

    private correctMonthAndDate(event: Event) {
        const targetElement = event.target as HTMLInputElement;
        let inputFieldValue = targetElement!.value;
        if (inputFieldValue) {
            const monthAndDateLength = inputFieldValue.length;
            switch (monthAndDateLength) {
                case 1:
                    if (+inputFieldValue[0]! > 1) {
                        inputFieldValue = inputFieldValue.slice(0, -1);
                        targetElement.value = inputFieldValue;
                    }
                    break;
                case 2:
                    if (+inputFieldValue[0]! === 1) {
                        if (+inputFieldValue[1]! > 2) {
                            inputFieldValue = inputFieldValue.slice(0, -1);
                            targetElement.value = inputFieldValue;
                        }
                    }
                    if (+inputFieldValue[0]! === 0) {
                        if (+inputFieldValue[1]! === 0) {
                            inputFieldValue = inputFieldValue.slice(0, -1);
                            targetElement.value = inputFieldValue;
                        }
                    }
                    break;
                case 4:
                    if (+inputFieldValue[3]! !== 2) {
                        inputFieldValue = inputFieldValue.slice(0, -1);
                        targetElement.value = inputFieldValue;
                    }
                    break;
                case 5:
                    if (+inputFieldValue[3]! === 2) {
                        if (+inputFieldValue[4]! < 3 || +inputFieldValue[4]! > 9) {
                            inputFieldValue = inputFieldValue.slice(0, -1);
                            targetElement.value = inputFieldValue;
                        }
                    }
                    break;
            }
        }
    }

    private validateFormBeforeSubmitting(event: Event) {
        event.preventDefault();
        const inputFields = Array.from(document.querySelectorAll(".input-field")) as HTMLInputElement[];
        const isAllFieldsValid = inputFields.every((item) => item.dataset["validity"] === "true");
        const isAllFieldsInvalid = inputFields.some((item) => item.dataset["validity"] === "false");
        if (isAllFieldsValid) {
            const order = document.getElementById("order") as HTMLFormElement;
            const popUp = document.getElementById("pop-up") as HTMLDivElement;
            const orderProcessed = document.getElementById("order-processed") as HTMLDivElement;
            order.classList.add("element_invisible");
            orderProcessed.classList.remove("element_invisible");
            setTimeout(() => {
                popUp.classList.add("element_invisible");
                orderProcessed.classList.add("element_invisible");
                order.classList.remove("element_invisible");
                order!.reset();
                app.cart.totalCount = 0;
                app.cart.totalPrice = 0;
                app.cart.cartProducts.length = 0;
                app.cart.saveToLocalStorage();
                app.header.drawHeader(app.cart);
                app.router.route("/");
            }, 3000);
        } else if (isAllFieldsInvalid) {
            inputFields.forEach((item) => {
                if (item.dataset["validity"] === "false") {
                    item.classList.add("input-field_invalid");
                }
            });
        }
    }
}
