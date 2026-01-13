import { useTranslations } from "next-intl";

import { getUserDetailsColumns } from "@/data/user-details";
import { UserProfileCardProps } from "@/types/table";

export const UserDetails: React.FC<UserProfileCardProps> = ({ user }) => {
  const t = useTranslations("listing.userDetails");

  const columns = getUserDetailsColumns(user, t);

  return (
    <div className="row">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="col-md-4 px-4 pt-2">
          {column.fields.map((field, fieldIndex) => (
            <div key={fieldIndex} className="mb-2">
              <strong className="lh-lg d-block">
                {t(field.labelKey)}
              </strong>

              {field.type === "badge" ? (
                <span className="badge bg-primary">{field.value}</span>
              ) : (
                <p className="mb-1 text-primary">{field.value}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
