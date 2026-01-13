import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Image } from "react-bootstrap";

import ActionButton from "@/components/pure-components/ActionButton";
import Card from "@/components/pure-components/Card/Card";
import Status from "@/components/pure-components/Status";
import { DEFAULT_CARD_IMAGE, VARIANT } from "@/constants";
import { CommonCardProps } from "@/types/table";
import { formatDate } from "@/utils/formatDate";
const CommonCard = <
  T extends {
    id: string | number;
    name?: string;
    description?: string;
    email?: string;
    image?: string;
    status?: number;
    createdAt?: string;
  },
>({
  items,
  onEdit,
  onDelete,
  showActions = true,
}: CommonCardProps<T>) => {
  const { name, description, email, image, status = 0, createdAt } = items;

  const cardImage = image || DEFAULT_CARD_IMAGE;

  return (
    <Card variant="default" bordered className="mb-3 h-100 custom-card">
      {/* Image */}
      <div className="card-image">
        <Image
          src={cardImage}
          alt={name || "card-image"}
          className="w-100 h-100 object-fit-cover rounded mb-1"
        />
      </div>

      {/* Content */}
      <div className="px-2 pt-2">
        {name && <h6 className="mb-2 card-heading  line-clamp-2">{name || "-"}</h6>}
        {description && (
          <p className="text-muted mb-2 card-description line-clamp-2">{description}</p>
        )}
        {email && <p className="text-muted small mb-1">{email}</p>}

        <div className="d-flex justify-content-between align-items-center">
          {createdAt && <small className="text-muted">{formatDate(createdAt)}</small>}
        </div>

        {/* Actions */}
        <div className="d-flex gap-1 mt-2 mb-1 pt-1 justify-content-between border-top pt-2">
          <Status
            variant={status === 0 ? VARIANT.ACTIVE : VARIANT.INACTIVE}
            label={
              status === 0
                ? VARIANT.ACTIVE.charAt(0).toUpperCase() + VARIANT.ACTIVE.slice(1)
                : VARIANT.INACTIVE.charAt(0).toUpperCase() + VARIANT.INACTIVE.slice(1)
            }
          />
          {showActions && (
            <div className="action-wrap card-action-wrap d-flex gap-1">
              {onEdit && (
                <ActionButton
                  icon={<Pencil size={16} />}
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(items)}
                />
              )}

              {onDelete && (
                <ActionButton
                  icon={<Trash2 size={16} />}
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(items)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommonCard;
