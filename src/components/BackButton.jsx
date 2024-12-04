import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
    const navigate = useNavigate();

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1); // Здесь используем переменную navigate
    };

    return (
        <Button type='back' onClick={goBack}>&larr; Back
        </Button>
    )
}

export default BackButton;
