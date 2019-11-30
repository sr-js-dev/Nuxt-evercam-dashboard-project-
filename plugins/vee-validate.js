import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend('required', required);
extend('email', {
  ...email,
  message: "Invalid email"
});
