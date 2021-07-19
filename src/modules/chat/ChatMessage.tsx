import React from "react";
import { IMessage } from "./message.interface";
import styled from "../../shared/libs/styled-components.lib";
import moment from "../../shared/libs/moment.lib";
import colors from "../../shared/constants/colors.const";

interface ChatMessageWrapperProps {
  alignToRight: boolean;
  light: boolean;
}

const Wrapper = styled("div")((props: ChatMessageWrapperProps) => ({
  backgroundColor: props.light ? colors.primary.light : colors.primary.main,
  color: colors.common.white,
  borderRadius: "0.5rem",
  padding: "1rem",
  fontSize: "1.2rem",
  alignSelf: props.alignToRight ? "flex-end" : "flex-start",
  "&:not(:last-child)": {
    marginBottom: "1rem",
  },
  sub: {
    fontSize: "0.75rem",
  },
}));

interface ChatMessageProps {
  message: IMessage;
  isFromMe: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isFromMe }) => {
  return (
    <Wrapper alignToRight={isFromMe} light={isFromMe}>
      <div>{message.message}</div>
      <sub>
        {isFromMe ? "Me" : message.userName}, at{" "}
        {moment(message.time).format("dd HH:mm")}
      </sub>
    </Wrapper>
  );
};

export default ChatMessage;
