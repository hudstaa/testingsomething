import Linkify from "linkify-react";
import { PropsWithChildren } from "react"
import { TwitterNameLink } from "./MemberBadge";
import { CashTag } from "./PostCard";

export const TaggableContent: React.FC<PropsWithChildren> = ({ children }) => {
    return <Linkify options={{
        render: (props) => {
            if (!props || !props.content) {
                return <></>
            }
            const content = props.content;
            if (content.startsWith("$")) {
                // const info = sugar.known_pairs[content.toLowerCase().slice(1)];
                // if (!info) {
                return <CashTag content={content} />
                // }
                // return <CashTag content={content} />
            } else if (content.startsWith("@")) {
                return <TwitterNameLink twitterName={content.toLowerCase().slice(1)} />
            } else {
                return <a {...props}>{content}</a>
            }
        },
        formatHref:
        {
            mention: (href) => "https://tribe.computer/member/" + href.substring(1),
        }
    }}>
        {children}
    </Linkify>
}