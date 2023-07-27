import { useState } from "react";

// 최초 수량 + 수량 증가 함수 + 수량 감소 함수
const Counter = ({onIncrease, onDecrease, initialCount}) => {
    const [count, setCount] = useState(initialCount);

    const handleOnIncrease = () => {
        setCount(count + 1);
        onIncrease(count + 1);
    }

    const handleOnDecrease = () => {
        if (count > 0) {
            setCount(count - 1);
            onDecrease(count - 1);
        }
    }

    return (
        <div className="counter">
            <button onClick={handleOnDecrease}>-</button>
            <span className="count">{count}</span>
            <button onClick={handleOnIncrease}>+</button>
        </div>
    );
};

export default Counter;