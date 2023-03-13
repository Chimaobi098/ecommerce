import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  width: 100%;
  background-color: red;
`;
export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CategoryItem = styled(motion.button)`
  all: unset;
  border-top: 1px solid grey;
  padding: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
`;
