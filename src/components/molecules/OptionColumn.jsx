import { useState } from "react";
import { comma } from "../../utils/comma";
import { useMutation } from "@tanstack/react-query";
import { addCart } from './../services/cart';
import { cartSuccessMessage, cartFailedMessage, cartLoginNeedMessage } from "../../utils/constants";
import Swal from "sweetalert2";
import OptionList from "../atoms/OptionList";
import Counter from "../atoms/Counter";
import Button from './../atoms/Button';
import { useNavigate } from "react-router-dom";

const OptionColumn = ({ product }) => {
    /**
     * 사용자가 담은 옵션을 처리함
     * UI단에서 표시하기 위해 4가지 옵션값을  받아서 처리해줌
     */
    const [selectedOptions, setSelectedOptions] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleOnClickOption = (option) => {
        // console.log(option.id)
        // 사용자가 선택한 옵션이 이미 담겨져있는 옵션인지 아닌지 판별
        const isOptionSelected = selectedOptions.find(
            (el) => el.optionId === option.id
        );

        // (아무 변화 없음 유지)
        if (isOptionSelected) {
            return;
        }

        setSelectedOptions((prev) => [
            ...prev, 
            {
                optionId: option.id,
                quantity: 1,
                price: option.price,
                name: option.optionName,
            }
        ])
    }

    const handleOnChange = (count, optionId) => {
        console.log(count)
        console.log(optionId)
        setSelectedOptions((prev) => {
            return prev.map((el) => {
                if (el.optionId === optionId) {
                    // Counter를 통해 변경된 값으로 업데이트
                    return {
                        ...el,
                        quantity: count,
                    }
                }
                return el;
            })
        })
    }

    // 장바구니를 담는 API 처리 - post 메서드 사용
    // react-query의 useMutation 사용
    // mutate를 따로 빼낸다음, mutate 실행 시 addCart가 실행됨
    // mutate를 원하는 곳에다가 배치!
    const { mutate } = useMutation({
        mutationFn: addCart,
    });

    return (
        <div className="option-column">
            <h3>옵션 선택</h3>
            <OptionList 
                options={product.options} 
                onClick={handleOnClickOption} 
            />
            {/* 담긴 옵션을 표시할 부분 - 옵션 이름 + 가격 + 수량 + 총 가격 */}
            {/* Counter : 옵션 개수를 변경할 수 있는 기능을 제공하는 컴포넌트! */}
            {selectedOptions.map((option) => (
                <ol key={option.optionId} className="selected-option-list">
                    <li className="selected-option">
                        <Counter
                            onDecrease={(count) => handleOnChange(count, option.optionId)}
                            onIncrease={(count) => handleOnChange(count, option.optionId)}
                        />
                        <span className="name">{option.name} </span>
                        <span className="quantity">{option.quantity}개 </span>
                        <span className="price">{`${comma(option.price)} * ${option.quantity} = ${comma(option.price * option.quantity)}`}원</span>
                    </li>
                </ol>
            ))}
            <hr />
            <div className="total-price">
                <span>총 수량: {
                    comma(selectedOptions.reduce((acc, cur) => {
                        return acc + cur.quantity;
                    }, 0))}개 
                </span>
                <br/>
                <span>총 상품금액: {
                    comma(selectedOptions.reduce((acc, cur) => {
                        return acc + cur.quantity * cur.price;
                    }, 0))}원 
                </span>
            </div>
            <div className="button-group">
                <Button onClick={() => {
                    // 백엔드에서 원하는 데이터만 담아서 보내주어야 함!
                    // 따라서, optionId, quantity만 골라서 mutate를 실행한다.
                    mutate(selectedOptions.map((el) => {
                        return {
                            optionId: el.optionId,
                            quantity: el.quantity,
                        }
                    }), {
                        onSuccess: () => {
                            token 
                            ? Swal.fire(cartSuccessMessage) 
                            : Swal.fire(cartLoginNeedMessage)
                            .then(navigate("/login"))
                        },
                        onError: () => {
                            // 적절하지 않은 값에 대해 장바구니 담기 - 에러 핸들링 처리
                            Swal.fire(cartFailedMessage)
                            .then(navigate("/notFoundPage"))
                        }
                    });
                }}></Button>
            </div>
        </div>
    );
};

export default OptionColumn;