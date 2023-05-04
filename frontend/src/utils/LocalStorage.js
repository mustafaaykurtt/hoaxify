import SecureLS from "secure-ls";

const secureLs = new SecureLS();

export const getLocalStorage = () => {
   return secureLs.get('hoax_auth');
}

export const saveStateToLocalStorage = (state) => {
    clearLocalStorage();
    secureLs.set("hoax_auth", state);
};

export const clearLocalStorage = () => {
    secureLs.removeAll("hoax_auth");
}

