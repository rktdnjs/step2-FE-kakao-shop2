// import Container from '../atoms/Container';
import ProductInformationColumn from './../molecules/ProductInformationColumn';
import OptionColumn from '../molecules/OptionColumn';
import styled from "styled-components";
import Container from './../atoms/Container';

const ProductDetailTemplate = ({ product }) => {
    return (
        <ProductDetailTemplateContainer>
            <ProductInformationColumn product={product} />
            <OptionColumn product={product} />
        </ProductDetailTemplateContainer>
    );
};

export default ProductDetailTemplate;

const ProductDetailTemplateContainer = styled(Container)`
    display:flex;
    justify-content: center;
    min-height: 2000px;
`